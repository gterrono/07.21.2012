class RequestsController < ApplicationController
  # GET /requests
  # GET /requests.json
  def index
    if params[:check_in_id]
      @requests = CheckIn.find(params[:check_in_id]).requests
    else
      @requests = Request.all
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: "["+@requests.map {|r| r.to_json}.join(",")+"]"}
    end
  end

  # GET /requests/1
  # GET /requests/1.json
  def show
    @request = Request.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @request }
    end
  end

  # GET /requests/new
  # GET /requests/new.json
  def new
    @request = Request.new
    @request.user = User.find(params['user'])
    @request.address = @request.user.addresses[0]
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @request }
    end
  end

  # GET /requests/1/edit
  def edit
    @request = Request.find(params[:id])
  end

  # POST /requests
  # POST /requests.json
  def create
    puts params.to_s
    @request = Request.new(:order => params[:request][:order],
      :details => params[:request][:details],
      :payment => params[:request][:payment])
    @request.user = User.find(params[:request][:user])
    @request.address = Address.find(params[:request][:address])
    @request.check_in = CheckIn.find(params[:request][:check_in])

    respond_to do |format|
      if @request.save
        format.html { redirect_to @request, notice: 'Request was successfully created.' }
        format.json { render json: @request, status: :created, location: @request }
      else
        format.html { render action: "new" }
        format.json { render json: @request.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /requests/1
  # PUT /requests/1.json
  def update
    @request = Request.find(params[:id])

    respond_to do |format|
      if @request.update_attributes(params[:request])
        format.html { redirect_to @request, notice: 'Request was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @request.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /requests/1
  # DELETE /requests/1.json
  def destroy
    @request = Request.find(params[:id])
    @request.destroy

    respond_to do |format|
      format.html { redirect_to requests_url }
      format.json { head :no_content }
    end
  end
end
